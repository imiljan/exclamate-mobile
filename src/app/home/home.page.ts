import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor() {}

  ngOnInit(): void {
    Storage.get({ key: 'authData' }).then((res) => console.log(res));
  }
}
