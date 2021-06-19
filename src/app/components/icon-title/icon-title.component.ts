import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
    const component: any = this.activeRouter.component;
    const pageTitle = {
      title: null,
      icon: null,
    };
    switch (component.name) {
      case 'OrderListComponent':
        pageTitle.title = 'Ordenes';
        pageTitle.icon = 'mdi-format-list-bulleted-type';
        return pageTitle;
      case 'AdminCommercesComponent':
        pageTitle.title = 'Adm. Comercios';
        pageTitle.icon = 'mdi-store';
        return pageTitle;
      case 'ProductFormComponent':
        pageTitle.title = 'Adm. Productos';
        pageTitle.icon = 'mdi-package-variant-closed';
        return pageTitle;
      default:
        return '';
    }
  }
}
