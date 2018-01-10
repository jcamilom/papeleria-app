import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Debt } from '../../models/debt';
import { DebtsProvider } from '../../providers/providers';
import { MessagesProvider } from '../../providers/providers';

const removeDebtTitle: string = 'Eliminar deuda';
const removeDebtMessage: string = '¿Está seguro que desea eliminar la deuda?';
const removeDebtMessageWarning: string = 'La deuda no ha sido pagada, ¿está seguro que desea eliminarla?';
const debtPaymentSuccess: string = 'El abono se registró exitosamente.';

@IonicPage()
@Component({
    selector: 'page-debts-detail',
    templateUrl: 'debts-detail.html',
})
export class DebtsDetailPage {

    debtor: string;
    debts: Debt[];
    ascDebts: Debt[];
    sumValues: number;
    sumPaidValues: number;
    debt: number;
    lastPaymentDate: Date;
    debtToRemove;
    debtToPay: Debt;
    debtToPayFlag: boolean;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private debtsProvider: DebtsProvider,
        private msgProvider: MessagesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebtsDetailPage');
        // Used when a single debt will be paid
        this.debtToPayFlag = false;
        // Get the passed values
        this.debtor = this.navParams.data.debtor;
        this.debts = this.navParams.data.debts;
        // Make a copy of the debts (asc by creation date) **reverse() affects the original
        this.ascDebts = this.debts.slice().reverse();
        // Set sumValues, sumPaidValues and debt
        this.generateSums();
        this.generateLastPaymentDate();
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter DebtsDetailPage');
    }

    ionViewWillLeave() {
        console.log('DebtsDetailPage ionViewWillLeave');
        if(this.debtsProvider.getUpdateAvailable()) {
            this.debtsProvider.getDebts();
            console.log("Update allDebts from ionViewWillLeave");
        }
    }

    private generateSums() {
        this.generateSumValues();
        this.generateSumPaidValues();
        this.debt = this.sumValues - this.sumPaidValues;
    }

    private generateSumValues() {
        this.sumValues = 0;
        for(let debt of this.debts) {
            this.sumValues += debt.value;
        }
    }

    private generateSumPaidValues() {
        this.sumPaidValues = 0;
        for(let debt of this.debts) {
            this.sumPaidValues += debt.paidValue;
        }
    }

    private generateLastPaymentDate() {
        // Generate a default date to compare: 1970-01-01T00:00:00.000Z
        let defaultDate = new Date(0);
        for(let debt of this.debts) {
            let updDate = debt.updatedAt;
            if(updDate != null && updDate > defaultDate) {
                defaultDate = updDate;
                this.lastPaymentDate = updDate;
            }
        }
    }

    public settleDebt(debt?: Debt) {
        // Pay single debt
        if(debt) {
            let theDebt = debt.value - debt.paidValue;
            if(theDebt > 0) {
                this.debtToPayFlag = true;
                this.debtToPay = debt;
                this.msgProvider.showAlertPrompt(this.settleDebtHandler,
                    [{name: 'value', type: 'number', min: 0, value: String(theDebt)}],
                    'Abonar deuda', 'Ingrese el valor a abonar: ', 'Abonar', this.settleDebtCancelHandler);
            } else {
                this.msgProvider.presentToast('Esta deuda ya ha sido completamente pagada.');
            }
        }
        // Pay multiple debts
        else {
            if(this.debt > 0) {
                this.msgProvider.showAlertPrompt(this.settleDebtHandler,
                    [{name: 'value', type: 'number', min: 0, value: String(this.debt)}],
                    'Abonar deuda', 'Ingrese el valor a abonar: ', 'Abonar');
            } else {
                this.msgProvider.presentToast('Todas las deudas de ' + this.debtor + ' ya han sido pagadas.');
            }
        }
    }

    public settleDebtHandler = (data: any) : void => {
        // Debt(ValueToPay) for both single and multiple payments
        let theDebt = this.debtToPayFlag ? (this.debtToPay.value - this.debtToPay.paidValue) : this.debt;
        let parsedInstallment: number = parseInt(data.value);
        // Check if it's a valid value
        if(!isNaN(parsedInstallment)) {
            // Chek if it's a positive value
            if(parsedInstallment >= 0) {
                // Check if the value is less than the debt
                if(parsedInstallment <= theDebt) {
                    // Pay single debt
                    if(this.debtToPayFlag) {
                        // Pay a portion of this debt
                        this.debtToPay.paidValue += parsedInstallment;
                        // Check if this debt is now fully paid
                        if(this.debtToPay.value == this.debtToPay.paidValue) this.debtToPay.paid = true;
                        // Update the debt in the db
                        let debtToUpdate = {
                            id: this.debtToPay.id,
                            body: {
                                paidValue: this.debtToPay.paidValue,
                                paid: this.debtToPay.paid}
                        };
                        this.updateDebt(debtToUpdate, true);
                        // Update the values to pay
                        this.generateSumPaidValues();
                        this.debt = this.sumValues - this.sumPaidValues;
                        // Clear the single payment variables
                        this.debtToPayFlag = false;
                        this.debtToPay = null;
                    }
                    // Look for the oldest debts and settle them
                    else {
                        this.loopSettleDebts(parsedInstallment); 
                    }                    
                } else {
                    // Bigger value
                    this.msgProvider.presentToast(
                        "No se pudo generar el abono. El valor ingresado es mayor a la deuda.", true);
                }
            } else {
                // Negative value
                this.msgProvider.presentToast(
                    "No se pudo generar el abono. El valor ingresado debe ser positivo.", true);
            }
        } else {
            // Not valid number
            this.msgProvider.presentToast(
                "No se pudo generar el abono. El valor ingresado no es válido.", true);
        }
    }

    public settleDebtCancelHandler = (data: any) : void => {
        this.debtToPayFlag = false;
        this.debtToPay = null;
    }

    loopSettleDebts(value: number) {
        let debtValue: number;
        let _break = false;
        // Loop the debts and pay the most of them
        for(let debt of this.ascDebts) {
            // If the debt is paid, go for the next one
            if(debt.paid) continue;

            // If not, analyze it
            debtValue = debt.value - debt.paidValue;
            if(debtValue < value) {
                // Pay the whole debt and go for the next one
                value -= debtValue;
                debt.paidValue = debt.value;
                debt.paid = true;
            } else {
                // pay a portion of this debt and break
                debt.paidValue += value;
                // Check if this debt is now fully paid
                if(debt.value == debt.paidValue) debt.paid = true;
                // There is no more money to keep paying, so break
                _break = true;
            }

            // Update the debt in the db
            let debtToUpdate = {id: debt.id, body: {paidValue: debt.paidValue, paid: debt.paid}};
            this.updateDebt(debtToUpdate, _break);

            if(_break) break;
        }

        // Update the values to pay
        this.generateSumPaidValues();
        this.debt = this.sumValues - this.sumPaidValues;
    }

    updateDebt(debt: any, updateLastPaymentDate: boolean) {
        this.debtsProvider.updateDebt(debt).subscribe((resp) => {
            if(resp.status == 'success') {
                let respDebt = resp.data[0];
                // Update allDebts (for this page and global)
                //this.debtsProvider.getAllDebts();
                console.log(respDebt.id + " updated!");
                // Update the debt in the local array of debts
                //let index = this.debts.findIndex(this.debtsProvider.findDebtById, [respDebt.id]);
                //if(index > -1) {
                    //this.debts[index] = respDebt;
                    // Update lastPaymentDate
                    if(updateLastPaymentDate) {
                        this.lastPaymentDate = new Date(respDebt.updatedAt);
                        // Notify the user that the debt was successfully paid
                        this.msgProvider.presentToast(debtPaymentSuccess);
                    }
                //}
                // Set the flag for updating the debts for the other pages (before leaving the page)
                this.debtsProvider.setUpdateAvailable(true);
            } else {
                // Notify the user that the sale couldn't be added
                //this.msgProvider.presentToast('El ítem no pudo ser añadido.', true);
                console.log("The debt couldnt be updated");
            }
        }, (err) => { 
            // Error. It's possible that debt already exists
            /* this.msgProvider.presentToast(
                `No se pudo crear el ítem. Es posible que este ítem
                    ya exista en la base de datos.`, true); */
            throw(err);
        });
    }

    public removeDebtEvent(debt: Debt) {
        // Tag the debt to remove
        this.debtToRemove = debt;
        // Show confirmation alert
        let message = debt.paid ? removeDebtMessage : removeDebtMessageWarning;
        this.msgProvider.showConfirmAlert(this.removeDebtHandler, removeDebtTitle, message);
    }

    public removeDebtHandler = () => {
        this.removeDebt(this.debtToRemove);
    }

    public removeDebt(debt: Debt) {
        this.debtsProvider.deleteDebt(debt).subscribe((resp) => {
            if(resp.status == 'success') {
                // Remove debt from the local array
                let index = this.debts.findIndex(this.debtsProvider.findDebtById, [resp.data[0].id]);
                // The debt exists -> remove it
                if(index > -1) this.debts.splice(index, 1);
                console.log("Debt " + resp.data[0].id + " deleted!");
                this.debtToRemove = null;
                // Set the flag for updating the debts for the other pages (before leaving the page)
                this.debtsProvider.setUpdateAvailable(true);
                // Update the values to pay
                this.generateSums();
                // Toast
                this.msgProvider.presentToast('La deuda fue eliminada exitosamente.');
            } else {
                console.log("The debt couldnt be deleted")
            }
        }, (err) => {
            console.log("The debt couldnt be deleted")
            throw(err);
        });
    }

}
