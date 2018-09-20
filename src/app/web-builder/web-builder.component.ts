import { Component, OnInit } from '@angular/core';
import grapesjs from 'grapesjs';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { MatDialog } from '@angular/material';
import { ICommonInterface } from '../model/commonInterface.model';
declare var grapesjs: any;
@Component({
  selector: 'app-web-builder',
  templateUrl: './web-builder.component.html',
  styleUrls: ['./web-builder.component.scss']
})
export class WebBuilderComponent implements OnInit {
  html: string;
  css: string;
  preHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.0/owl.carousel.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js"></script>
    </head><body>`;
  postHtml = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.17.0/jquery.validate.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.0/owl.carousel.min.js"></script>
    </body><html>`;
  postCss = '';
  preCss = `.slick-slide {
        height: auto !important;
      }
      .smm_home_block .slick-arrow {
        background-repeat: no-repeat;
      }`;
  editorData: any;
  isUpdate: boolean;
  html1: any;
  deploymentId: any;
  deploymentTime: any;
  arrayDomainsListPopup: any[];
  domainName: any;
  isDomainName: boolean;
  constructor(private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {
    // this.getDomainData();
    this.getListOfExistingDomains();
  }

  ngOnInit() {
    this.getData();
  }
  getData = async () => {
    this.editorData = await this.getDomainData();
    let htmlString;
    let cssString;
    this.spinnerService.show();
    if (this.editorData) {
      this.editorData.file_content.forEach(element => {
        if (element.index) {
          htmlString = element.index;
        } else {
          cssString = element.style;
        }
      });
      this.initEditor(htmlString, cssString);
      this.deploymentTime = this.editorData.deployment_details.updated_at;
      this.isUpdate = true;
      this.spinnerService.hide();
    } else if (this.editorData === null) {
      // tslint:disable-next-line:no-shadowed-variable
      const cssString = 'h2{color: red}';
      // tslint:disable-next-line:no-shadowed-variable
      const htmlString = '<h2>Plesase place your code</h2>';
      this.initEditor(htmlString, cssString);
      this.spinnerService.hide();
    }
  }
  initEditor = (htmlString: string, cssString: string) => {
    const editor = grapesjs.init({
      container: '#gjs',
      canvas: {
        scripts: [
          'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
          'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
          'http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/jquery.validate.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.2.0/owl.carousel.min.js']
      },
      blocks: ['link-block', 'quote', 'text-basic'],
      showStylesOnChange: true,
      showOffsets: 1,
      avoidInlineStyle: 1,
      allowScripts: 1,
      textCleanCanvas: 'Are you sure to clean the canvas?',
      textGeneral: 'General',
      textLayout: 'Layout',
      textTypography: 'Typography',
      textExtra: 'Extra',
      textFlex: 'Flex',
      blocksBasicOpts: true,
      storageManager: { autoload: 0 },
      buildProps: ['font-family'],
      properties: [
        {
          property: 'font-family',
          name: 'Font',
          list: [
            { name: 'Oswald', value: 'Oswald, Oswald, sans-serif;' }
          ]
        }],
      plugins: ['gjs-blocks-flexbox',
        'gjs-social',
        'gjs-preset-webpage'],
      pluginsOpts: {
        'gjs-blocks-basic': {
          blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map'],
          category: 'Basic',
        },
        'gjs-social': {
          // options
        },
        // 'gjs-aviary': {/* ...options */ },
        // 'gjs-plugin-forms': {},
        // 'gjs-plugin-ckeditor': {
        //   skin: 'Icy Orange',
        // },
        // 'gjs-component-countdown': {},
        // 'gjs-navbar': {},
        'gjs-preset-webpage': {
          modalImportTitle: 'Import Template',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          // tslint:disable-next-line:no-shadowed-variable
          modalImportContent: editor => editor.getHtml(),
          formsOpts: {},
          blocksBasicOpts: {},
          countdownOpts: {},
        },
      },
      assetManager: {
        embedAsBase64: 1,
        // dropzone: 1,
        upload: 'https://test.page',
        params: {
          _token: 'pCYrSwjuiV0t5NVtZpQDY41Gn5lNUwo3it1FIkAj',
        },
        assets: [
          { type: 'image', src: 'http://placehold.it/350x250/78c5d6/fff/image1.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/79c267/fff/image3.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/c5d647/fff/image4.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/f28c33/fff/image5.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/e868a2/fff/image6.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', date: '2015-02-01', height: 1080, width: 1728 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', date: '2015-02-01', height: 650, width: 320 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', date: '2015-02-01', height: 1, width: 1728 },
        ]
      },
    });
    editor.setComponents(htmlString);
    editor.setStyle(cssString);
    const interval = setInterval(() => {
      this.html = (this.preHtml + editor.getHtml() + this.postHtml);
      this.html1 = (editor.getHtml());
      this.css = (this.preCss + editor.getCss() + this.postCss);
    }, 2000);
  }
  postDomianData = () => {
    this.spinnerService.show();
    const formModel = {
      'client_id': localStorage.getItem('client_id'),
      'domain_name': 'smm.flujo.in',
      'html': this.html,
      'css': this.css
    };
    this.httpClient.post<IHttpResponse>(AppConstants.API_URL + 'deployments/createdeployment', formModel)
      .subscribe(
        data => {
          console.log(data);
          this.spinnerService.hide();
          this.alertService.success('Domain publihed successfully');
        }, err => {
          console.log(err);
          this.spinnerService.hide();
          this.alertService.warning('Something went wrong');
        }
      );
  }
  getDomainData = (): Promise<any> => {
    this.spinnerService.show();
    return new Promise((resolve, reject) => {
      const formModel = {
        'client_id': localStorage.getItem('client_id'),
        'domain_name': 'smm.flujo.in'
      };
      this.httpClient.post<IHttpResponse>(AppConstants.API_URL + 'deployments/deployment/deploymentfilecontent', formModel)
        .subscribe(
          data => {
            resolve(data.result);
            this.spinnerService.hide();
          }, err => {
            console.log(err);
            reject(err);
            this.spinnerService.hide();
          }
        );
    });
  }
  updateDomainData = () => {
    this.spinnerService.show();
    const formModel = {
      'client_id': localStorage.getItem('client_id'),
      'domain_name': 'smm.flujo.in',
      'html': this.html1,
      'css': this.css
    };
    this.httpClient.post<any>(AppConstants.API_URL + 'deployments/updateolddeployment', formModel)
      .subscribe(
        data => {
          if (data.result && !data.error) {
            this.deploymentId = data.result[0].deployment_id;
            this.deploymentTime = data.result[0].created_at;
            this.spinnerService.hide();
            this.alertService.info('Updated Successfully');
          } else {
            this.alertService.warning('Failed to update please try again');
            this.spinnerService.hide();
          }
        }, err => {
          this.spinnerService.hide();
          console.log(err);
          this.alertService.info('Something went wrong');
        }
      );
  }
  getListOfExistingDomains = () => {
    this.httpClient.get<ICommonInterface>(`${AppConstants.API_URL}domains/${AppConstants.CLIENT_ID}`)
      .subscribe(
        successResp => {
          console.log(successResp);
          if (!successResp.error) {
            this.arrayDomainsListPopup = successResp.result;
          }
        },
        errorResp => {
          console.log(errorResp);
        }
      );
  }
  selectDoaminName = (liveDomainName) => {
    this.domainName = liveDomainName;
    this.isDomainName = true;
  }
  postDataToLiveServer = () => {
    const formModel = {
        'client_id': localStorage.getItem('client_id'),
        'domain_name': this.domainName,
        'deployment_id': this.deploymentId,
    };
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'deployments/makeitlive', formModel)
    .subscribe(
        data => {
            if (data.custom_status_code === 100 && !data.error) {
              console.log(data);
              this.alertService.success('Domain updated successfully to live server');
            } else {
              this.alertService.warning('Something went wrong');
            }
        }, err => {
            console.log(err);
            this.alertService.warning('Something went wrong');
        }
    );
}
}
