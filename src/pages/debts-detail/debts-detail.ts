import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Debt } from '../../models/debt';
import { DebtsProvider } from '../../providers/providers';
import { MessagesProvider } from '../../providers/providers';

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
    debtsUpdated: boolean;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private debtsProvider: DebtsProvider,
        private msgProvider: MessagesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebtsDetailPage');
        // Set the debtsUpdate
        this.debtsUpdated = false;
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

    public settleDebt() {
        this.msgProvider.showAlertPrompt(this.settleDebtHandler,
            [{name: 'value', type: 'number', min: 0, value: String(this.debt)}],
            'Abonar deuda', 'Ingrese el valor a abonar: ', 'Abonar');
    }

    public settleDebtHandler = (data: any) : void => {
        let parsedInstallment: number = parseInt(data.value);
        // Check if it's a valid value
        if(!isNaN(parsedInstallment)) {
            // Chek if it's a positive value
            if(parsedInstallment >= 0) {
                // Check if the value is less than the debt
                if(parsedInstallment <= this.debt) {
                    //Look for the oldest debt and settle it
                    this.loopSettleDebts(parsedInstallment);
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
                // Update allItems (for this page and global)
                //this.itemsProvider.getAllItems();
                // Notify the user that the item was successfully added
                //this.msgProvider.presentToast('Ítem añadido exitosamente.');
                console.log(respDebt.id + " updated!");
                // Update the debt in the local array of debts
                //let index = this.debts.findIndex(this.debtsProvider.findDebtById, [respDebt.id]);
                //if(index > -1) {
                    //this.debts[index] = respDebt;
                    // Update lastPaymentDate
                    if(updateLastPaymentDate) this.lastPaymentDate = new Date(respDebt.updatedAt);
                //}
                // Set the flag for updating the debts for the other pages (before leaving the page)
                this.debtsProvider.setUpdateAvailable(true);
            } else {
                // Notify the user that the sale couldn't be added
                //this.msgProvider.presentToast('El ítem no pudo ser añadido.', true);
                console.log("The debt couldnt be updated");
            }
        }, (err) => { 
            // Error. It's possible that item already exists
            /* this.msgProvider.presentToast(
                `No se pudo crear el ítem. Es posible que este ítem
                    ya exista en la base de datos.`, true); */
            throw(err);
        });
    }

}
