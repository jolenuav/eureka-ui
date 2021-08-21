import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-icon-title',
  templateUrl: './icon-title.component.html',
  styleUrls: ['./icon-title.component.scss'],
})
export class IconTitleComponent implements OnInit {
  pageTitle = this.getTitle();
  constructor(private activeRouter: ActivatedRoute) {}

  ngOnInit(): void {}
  getTitle(): any {
    const pageTitle = {
      title: null,
      icon: null,
    };
    const url = (this.activeRouter.url as any).value[0].path;
    switch (url) {
      case ROUTES.partner.orderList:
        pageTitle.title = 'Ordenes';
        pageTitle.icon = 'mdi-format-list-bulleted-type';
        return pageTitle;
      case ROUTES.partner.listCommerce:
        pageTitle.title = 'Lista de comercios';
        pageTitle.icon = 'mdi-format-list-bulleted';
        return pageTitle;
      case ROUTES.partner.adminCommerce:
        pageTitle.title = 'Adm. Comercios';
        pageTitle.icon = 'mdi-store';
        return pageTitle;
      case ROUTES.partner.listProduct:
        pageTitle.title = 'Lista de productos';
        pageTitle.icon = 'mdi-format-list-bulleted';
        return pageTitle;
      case ROUTES.partner.categories:
        pageTitle.title = 'Categorías de productos';
        pageTitle.icon = 'mdi-view-grid-outline';
        return pageTitle;
      case ROUTES.partner.adminProduct:
        pageTitle.title = 'Adm. Productos';
        pageTitle.icon = 'mdi-package-variant-closed';
        return pageTitle;
      case ROUTES.partner.stock:
        pageTitle.title = 'Stock';
        pageTitle.icon = 'mdi-text-box-search';
        return pageTitle;
      default:
        return '';
    }
  }
}
