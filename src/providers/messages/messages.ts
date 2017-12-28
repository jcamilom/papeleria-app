import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

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
                        console.log('Cancel clicked');
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

    public showCreateItemPrompt(createItemHander: (data: any) => any): void {
        let prompt = this.alertCtrl.create({
            title: 'Crear un ítem',
            //message: "Ingresar las siguientes características:",
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Nombre',
                    type: 'text'
                },
                {
                    name: 'price',
                    placeholder: 'Precio',
                    type: 'number',
                    min: 0
                },
                {
                    name: 'nAvailable',
                    placeholder: 'Cantidad',
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
                    text: 'Crear',
                    handler: createItemHander
                }
            ]
        });
        prompt.present();
    }

}
