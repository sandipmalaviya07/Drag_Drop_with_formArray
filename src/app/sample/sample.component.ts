import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ICustomerDocument, IDocument } from '../app.interface';

import * as jquery from 'jquery';

declare var $: any;

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css']
})
export class SampleComponent implements OnInit {
  custDocForm: FormGroup;
  docListForm: FormArray;
  docList: IDocument[] = [];
  isSubmitted: boolean = false;

  model: ICustomerDocument = <ICustomerDocument>{};

  constructor(
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeDocumentDetailForm();
    this.setDocumentOrder();
  }

  setDocumentOrder() {
    let self = this;
    setTimeout(() => {
      $("#sortable").sortable({
        revert: true,
        stop: function (event, ui) {
          self.SetDocuementIndex();
        }
      });
      $("#sortable").disableSelection();
    }, 1000);
  }

  SetDocuementIndex() {

    let childDiv = Array.from($("#sortable").children());
    let copyDocList = [];
    let _docList = this.GetDocumentList();

    for (var i = 0; i < childDiv.length; i++) {
      let element = childDiv[i];
      let _orderId = element["attributes"]["data-id"].value;
      let copyDoc = <IDocument>{};
      copyDoc = Object.assign({}, _docList.filter(f => f.orderNumber == _orderId)[0]);
      copyDoc.orderNumber = i + 1;
      copyDocList.push(copyDoc);
    }

    setTimeout(() => {
      this.docList = copyDocList;
      let _len = this.documentForm.controls.length;
      for (var idx = _len; idx > 0; idx--) {
        this.documentForm.removeAt(idx - 1);
      }

      for (var idx = 0; idx < this.docList.length; idx++) {
        let element = this.docList[idx];
        this.docListForm.controls.push(
          this.formBuilder.group({
            docName: [element.docName, Validators.required],
            orderNumber: [element.orderNumber, Validators.required],
          })
        );
      }

      this.cd.detectChanges();
    }, 200);

  }

  GetDocumentList() {
    let _docList = this.custForm.documents.value;
    if (_docList == null || _docList == undefined || _docList.length == 0) {
      if (this.docList != null && this.docList != undefined && this.docList.length > 0) {
        _docList = this.docList;
      }
    }
    else {
      this.docList = _docList;
    }
    return _docList;
  }



  initializeDocumentDetailForm() {
    this.custDocForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      documents: new FormArray([this.formBuilder.group({
        docName: ["Document 1", Validators.required],
        orderNumber: [1, Validators.required],
      })
      ]),
    });

    this.docListForm = this.custDocForm.get('documents') as FormArray;
  }

  get custForm() { return this.custDocForm.controls; }
  get documentForm() { return this.custForm.documents as FormArray; }

  getCustomerFormGroup(index): FormGroup {
    this.docListForm = this.custDocForm.get('documents') as FormArray;
    const formGroup = this.docListForm.controls[index] as FormGroup;
    return formGroup;
  }

  onSubmit() {
    this.isSubmitted = true;
    //Set model and save 
  }

  onAddDoc() {
    let _orderNo = this.docListForm.controls.length + 1;
    let _customer = <IDocument>
      {
        docName: "document " + _orderNo,
        orderNumber: _orderNo
      };

    this.docListForm.push(
      this.formBuilder.group({
        docName: [_customer.docName, Validators.required],
        orderNumber: [_customer.orderNumber, Validators.required]
      })
    );

  }


}
