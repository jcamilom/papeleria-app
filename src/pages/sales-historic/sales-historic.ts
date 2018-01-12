import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Sale } from '../../models/sale';
import { SalesProvider } from '../../providers/providers';
import { MessagesProvider } from '../../providers/providers';

import { MatTableDataSource } from '@angular/material';

const removeSaleTitle: string = 'Eliminar venta';
const removeSaleMessage: string = '¿Está seguro que desea eliminar la venta? Esta acción no se puede deshacer.';
const removeAttachedSaleMessage: string = `La venta que desea eliminar está ligada a una deuda. 
    Elimine primero dicha deuda para poder eliminar la venta.`;

@IonicPage()
@Component({
    selector: 'page-sales-historic',
    templateUrl: 'sales-historic.html',
})
export class SalesHistoricPage {

    private allSales: Sale[];
    public displayedColumns = ['id', 'createdAt', 'value', 'paid', 'paidValue', 'updatedAt', 'debtor'];
    private dataSource: MatTableDataSource<any>;
    private saleToRemove: Sale;
    private todayDate: Date;
    private weekDate: Date;
    private dateSegmentSelector: string;
    private startCustomDate: Date;
    private endCustomDate: Date;

    public customDate = {
        startDate: '2018-01-01',
        startTime: '08:00',
        endDate: '2018-01-01',
        endTime: '23:59',
    }

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private salesProvider: SalesProvider,
        private msgProvider: MessagesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SalesHistoricPage');

        this.dataSource = new MatTableDataSource<Sale[]>();

        // Initialize the segment
        this.dateSegmentSelector = "today";

        this.salesProvider.currentSales.subscribe(sales => {
            sales.sort(this.salesProvider.sortByCreatedAtDesc);
            this.allSales = sales;
            // Populate the table acording to the selected segment
            this.populateTable();
        });

        // Get all sales for provider
        this.salesProvider.getSales();
    }

    ionViewWillEnter() {
        console.log('SalesHistoricPage ionViewWillEnter');
        if(this.salesProvider.getUpdateAvailable()) {
            console.log('UpdateAvailable from SalesHistoricPage!');
            this.salesProvider.getSales();
        }
    }

    ionViewWillLeave() {
        console.log('SalesHistoricPage ionViewWillEnter');
        if(this.salesProvider.getUpdateAvailable()) {
            console.log('UpdateAvailable from SalesHistoricPage!');
            this.salesProvider.getSales();
        }
    }

    removeSaleEvent(sale: Sale) {
        // Allow removement only for sales not attached to a debt
        if(sale.debtor == null) {
            // Tag the sale to remove
            this.saleToRemove = sale;
            // Show confirmation alert
            this.msgProvider.showConfirmAlert(this.removeSaleHandler, removeSaleTitle, removeSaleMessage);
        } else {
            this.msgProvider.presentToast(removeAttachedSaleMessage, true);
        }
    }

    public removeSaleHandler = () => {
        this.removeSale(this.saleToRemove);
    }

    public removeSale(sale: Sale) {
        this.salesProvider.deleteSale(sale).subscribe((resp) => {
            if(resp.status == 'success') {
                console.log(resp.data[0].id + " deleted!");
                // Notify the user that the sale was successfully deleted
                this.msgProvider.presentToast('Venta eliminada exitosamente.');
                this.saleToRemove = null;
                // Update this page
                this.salesProvider.getSales();
            } else {
                console.log("The sale couldnt be deleted");
            }
        }, (err) => {
            console.log("The sale couldnt be deleted");
            throw(err);
        });
    }

    printDate(sale) {
        console.log(sale.createdAt);
        console.log("createdAt: " + sale.createdAt);
        console.log("Day: " + sale.createdAt.getDate());
        sale.createdAt.setHours(0,0,0,0);
        console.log(sale.createdAt);
        console.log("00:00-> " + sale.createdAt);
    }

    populateTable() {
        switch(this.dateSegmentSelector) {
            case 'today':
                this.generateTodayDate();
                // Filter the sales
                this.dataSource.data = this.allSales.filter(sale => sale.createdAt > this.todayDate);
                break;
            case 'week':
                this.generateWeekDate();
                // Filter the sales
                this.dataSource.data = this.allSales.filter(sale => sale.createdAt > this.weekDate);
                break;
            case 'custom':
                this.generateCustomDate();
                this.customSearch();
                break;
            default:
                break;
        }
    }

    generateTodayDate() {
        this.todayDate = new Date();
        // setHours and not setUTCHours, so time its set to 05:00:00 when the app runs in -05GMT
        this.todayDate.setHours(0,0,0,0);
    }

    generateWeekDate() {
        this.weekDate = new Date();
        this.weekDate.setHours(0,0,0,0);
        this.setDayToMonday(this.weekDate);
    }

    // Set day to monday this week
    setDayToMonday(date: Date) {
        let dayOfTheWeek = date.getDay();
        // For Tuesday till saturday
        if(dayOfTheWeek > 1) {
            date.setDate(date.getDate() - (dayOfTheWeek - 1));
        }
        // For Sunday
        else if (dayOfTheWeek == 0) {
            date.setDate(date.getDate() - 6);
        }
        console.log(this.weekDate);
    }

    generateCustomDate() {
        // Initialize the todayDate
        this.generateTodayDate();

        // Initialize the customDate
        let todayLocaleISOString = this.getLocaleISOString(this.todayDate);
        let splitedByT = todayLocaleISOString.split('T');
        this.customDate.startDate = splitedByT[0];
        this.customDate.startTime = splitedByT[1].split('.')[0];
        this.customDate.endDate = splitedByT[0];
        this.customDate.endTime = this.getLocaleISOString(new Date()).split('T')[1].split('.')[0];
    }
    
    getLocaleISOString(date: Date) {
        let date_copy = new Date(date.getTime());
        let currentTimeZoneOffset = date_copy.getTimezoneOffset();
        date_copy.setUTCMinutes(date_copy.getUTCMinutes() - currentTimeZoneOffset);
        
        return date_copy.toISOString();
    }

    customSearch() {
        this.startCustomDate = new Date(this.customDate.startDate + 'T' + this.customDate.startTime);
        this.endCustomDate = new Date(this.customDate.endDate + 'T' + this.customDate.endTime);
        // Filter the sales whitin the range
        this.dataSource.data = this.allSales.filter(sale => 
            sale.createdAt > this.startCustomDate && sale.createdAt < this.endCustomDate);
    }

}
