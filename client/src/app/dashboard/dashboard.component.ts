import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  constructor(
    private router: Router,
    private authservice: AuthService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    if (!this.authservice.isLoggedIn()) {
      this.router.navigateByUrl('/login');
    }

    const filterButton = document.querySelector('.jsFilter');
    const filterMenu = document.querySelector('.filter-menu');
    const gridButton = document.querySelector('.grid');
    const listButton = document.querySelector('.list');
    const productsAreaWrapper = document.querySelector(
      '.products-area-wrapper'
    );
    const modeSwitch = document.querySelector('.mode-switch');

    if (filterButton) {
      filterButton.addEventListener('click', function () {
        if (filterMenu) {
          filterMenu.classList.toggle('active');
        }
      });
    }

    if (gridButton) {
      gridButton.addEventListener('click', function () {
        if (listButton && productsAreaWrapper) {
          listButton.classList.remove('active');
          gridButton.classList.add('active');
          productsAreaWrapper.classList.add('gridView');
          productsAreaWrapper.classList.remove('tableView');
        }
      });
    }

    if (listButton) {
      listButton.addEventListener('click', function () {
        if (listButton && productsAreaWrapper) {
          listButton.classList.add('active');
          if (gridButton) {
            gridButton.classList.remove('active');
          }
          productsAreaWrapper.classList.remove('gridView');
          productsAreaWrapper.classList.add('tableView');
        }
      });
    }

    if (modeSwitch) {
      modeSwitch.addEventListener('click', function () {
        document.documentElement.classList.toggle('light');
        if (modeSwitch) {
          modeSwitch.classList.toggle('active');
        }
      });
    }

    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Gabim gjatë ngarkimit të produkteve:', error);
      }
    );
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
