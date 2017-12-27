import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

@Injectable()
export class MessagesProvider {

    constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) {
        //console.log('Hello MessagesProvider Provider');
    }

    public showConfirmAlert() {
        let alertConfirm = this.alertCtrl.create({
            title: 'Remover ítem',
            message: '¿Remover ítem del carrito de ventas?',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        alertConfirm.dismiss(false);
                        return false;
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        alertConfirm.dismiss(true);
                        return false;
                    }
                }
            ]
        });
        
        return alertConfirm;
    }

    public presentToast(msg: string, dur: number = 3000, pos: string = 'bottom') {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: dur,
            position: pos,
            closeButtonText: "cerrar",
            showCloseButton: true,
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
