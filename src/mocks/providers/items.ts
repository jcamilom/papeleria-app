import { Injectable } from '@angular/core';

import { Item } from '../../models/item';

@Injectable()
export class Items {
    items: Item[] = [];

    defaultItem: any = {
        "name": "Cuaderno rayado 100 hojas",
        "profilePic": "assets/img/speakers/bear.jpg",
        "about": "Burt is a Bear.",
        "id": "003",
        "price": 1800,
        "nAvailable": 14
    };


    constructor() {
        let items = [
            {
                "name": "Cuaderno rayado 50 hojas",
                "profilePic": "assets/img/speakers/bear.jpg",
                "about": "Burt is a Bear.",
                "id": "001",
                "price": 1200,
                "nAvailable": 10
            },
            {
                "name": "Cuaderno rayado 80 hojas",
                "profilePic": "assets/img/speakers/cheetah.jpg",
                "about": "Charlie is a Cheetah.",
                "id": "002",
                "price": 1400,
                "nAvailable": 12
            },
            {
                "name": "Cuaderno rayado 100 hojas",
                "profilePic": "assets/img/speakers/duck.jpg",
                "about": "Donald is a Duck.",
                "id": "003",
                "price": 1800,
                "nAvailable": 5
            },
            {
                "name": "Cuaderno cuadriculado 50 hojas",
                "profilePic": "assets/img/speakers/eagle.jpg",
                "about": "Eva is an Eagle.",
                "id": "004",
                "price": 1200,
                "nAvailable": 14
            },
            {
                "name": "Cuaderno cuadriculado 80 hojas",
                "profilePic": "assets/img/speakers/elephant.jpg",
                "about": "Ellie is an Elephant.",
                "id": "005",
                "price": 1400,
                "nAvailable": 18
            },
            {
                "name": "Cuaderno cuadriculado 100 hojas",
                "profilePic": "assets/img/speakers/mouse.jpg",
                "about": "Molly is a Mouse.",
                "id": "006",
                "price": 1800,
                "nAvailable": 20
            },
            {
                "name": "Block rayado",
                "profilePic": "assets/img/speakers/puppy.jpg",
                "about": "Paul is a Puppy.",
                "id": "007",
                "price": 2500,
                "nAvailable": 8
            },
            {
                "name": "Block cuadriculado",
                "profilePic": "assets/img/speakers/puppy.jpg",
                "about": "Paul is a Puppy.",
                "id": "008",
                "price": 2500,
                "nAvailable": 13
            },
            {
                "name": "Caja de colores grande",
                "profilePic": "assets/img/speakers/puppy.jpg",
                "about": "Paul is a Puppy.",
                "id": "009",
                "price": 25000,
                "nAvailable": 4
            },
            {
                "name": "Caja de colores pequeña",
                "profilePic": "assets/img/speakers/puppy.jpg",
                "about": "Paul is a Puppy.",
                "id": "010",
                "price": 12000,
                "nAvailable": 10
            }
        ];

        for (let item of items) {
            this.items.push(new Item(item));
        }
    }

    query(params?: any) {
        if (!params) {
            return this.items;
        }

        return this.items.filter((item) => {
            for (let key in params) {
                let field = item[key];
                if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
                    return item;
                } else if (field == params[key]) {
                    return item;
                }
            }
            return null;
        });
    }

    add(item: Item) {
        this.items.push(item);
    }

    delete(item: Item) {
        this.items.splice(this.items.indexOf(item), 1);
    }
}
