import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
})
export class MessageItemComponent implements OnInit {
  temp = 'foo';

  constructor(private router: Router) {}

  ngOnInit() {}

  onClick() {
    this.router.navigate(['home', 'tabs', 'messages', '123']);
  }
}
