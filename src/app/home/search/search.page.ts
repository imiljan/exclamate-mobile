import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchPageGQL, User } from '../../../generated/graphql';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  users: User[] = [];
  isLoading = false;

  constructor(private search: SearchPageGQL, private router: Router) {
  }

  ngOnInit() {
  }

  onSearchChange(event) {
    if (event.target.value === '') {
      this.users = [];
      return;
    }
    this.isLoading = true;
    this.search
      .fetch({ searchParam: event.target.value }, { fetchPolicy: 'no-cache' })
      .subscribe(({ data, loading }) => {
        this.users = data.getUsers.map((el) => ({ ...el, email: '' }));
        this.isLoading = loading;
        console.log(this.isLoading);
      });
  }

  openProfilePage(userId: number) {
    this.router.navigate(['profile', userId]);
  }
}
