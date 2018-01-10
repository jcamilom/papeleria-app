import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

import { Item } from '../../models/item';

@Injectable()
export class MessagesProvider {

    constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) {
        //console.log('Hello MessagesProvider Provider');
    }

    public showConfirmAlert(agreeHandler: () => any, title: string, message: string) {
        let alertConfirm = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        //console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Aceptar',
                    handler: agreeHandler
                }
            ]
        });
        
        alertConfirm.present();
    }

    public presentToast(msg: string, closeBtn: boolean = false, dur: number = 3000, pos: string = 'bottom') {
        // If close button is showed, make the toast present until user closes it.
        if(closeBtn == true) dur = null;
        let toast = this.toastCtrl.create({
            message: msg,
            duration: dur,
            position: pos,
            closeButtonText: "cerrar",
            showCloseButton: closeBtn,
            cssClass: "custom-toast"
        });
    
        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });
    
        toast.present();
    }

    public showAlertPrompt(agreeHandler: (data: any) => any, inputs: any,
        alertTitle: string, message: string, agreeText: string): void {
        
            let prompt = this.alertCtrl.create({
            title: alertTitle,
            message: message,
            inputs: inputs,
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: agreeText,
                    handler: agreeHandler
                }
            ]
        });
        prompt.present();
    }

    public showModifyItemPrompt(agreeHandler: (data: any) => any, item: Item): void {
        let prompt = this.alertCtrl.create({
            title: 'Modificar ítem',
            subTitle: item.name,
            inputs: [
                {
                    name: 'name',
                    placeholder: item.name,
                    type: 'text'
                },
                {
                    name: 'price',
                    placeholder: '$' + item.price,
                    type: 'number',
                    min: 0
                },
                {
                    name: 'nAvailable',
                    placeholder: item.nAvailable.toString(),
                    type: 'number',
                    min: 0
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Aceptar',
                    handler: agreeHandler
                }
            ]
        });
        prompt.present();
    }

}
