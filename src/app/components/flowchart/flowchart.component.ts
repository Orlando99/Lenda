import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.scss']
})
export class FlowchartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      var data = [
        {
          type: "icon-farmer",
          color: "#7F7F7F",
          number: "14"
        },
        {
          type: "icon-borrower",
          color: "#548235",
          number: "58"
        },
        {
          type: "icon-tree",
          color: "#548235",
          number: "79"
        },
        {
          type: "icon-irr",
          color: "#1F4E79",
          number: "56"
        },
        {
          type: "icon-ni",
          color: "#FFC000",
          number: "25"
        },
        {
          type: "icon-practices-left",
          color: "#7F7F7F",
          number: "36"
        },
        {
          type: "icon-practices-right",
          color: "#7F7F7F",
          number: "79"
        },
        {
          type: "icon-farm",
          color: "#548235",
          number: "89"
        },
        {
          type: "icon-budget",
          color: "#548235",
          number: "12"
        },
        {
          type: "icon-insurance",
          color: "#548235",
          number: "75"
        },
        {
          type: "icon-optimizer",
          color: "#548235",
          number: "78"
        },
        {
          type: "icon-collateral",
          color: "#548235",
          number: "89"
        },
        {
          type: "icon-risk-return-objectives",
          color: "#548235",
          number: "77"
        },
        {
          type: "icon-exceptions",
          color: "#FFC000",
          number: "57"
        },
        {
          type: "icon-mitigants-and-conditions",
          color: "#548235",
          number: "13"
        },
        {
          type: "icon-underwriting-documents",
          color: "#548235",
          number: "97"
        },
        {
          type: "icon-recommend",
          color: "#000000",
          number: "55"
        },
        {
          type: "icon-committee",
          color: "#0070C0",
          number: "37"
        },
        {
          type: "icon-collaboration",
          color: "#0070C0",
          number: "36"
        },
        {
          type: "icon-conditional-approval",
          color: "#548235",
          number: "46"
        },
        {
          type: "icon-prerequisite-documents",
          color: "#548235",
          number: "81"
        },
        {
          type: "icon-document-creation",
          color: "#000000",
          number: "49"
        },
        {
          type: "icon-closing-documents",
          color: "#548235",
          number: "65"
        },
        {
          type: "icon-loan-management",
          color: "#548235",
          number: "24"
        },
        {
          type: "icon-loan-inventory",
          color: "#548235",
          number: "35"
        },
        {
          type: "icon-insurance-verification",
          color: "#548235",
          number: "66"
        },
        {
          type: "icon-reconciliation",
          color: "#548235",
          number: "97"
        },
        {
          type: "icon-risk-team",
          color: "#FF0000",
          number: "34"
        },
        {
          type: "icon-product-manual",
          color: "#548235",
          number: "11"
        },
        {
          type: "icon-policy-manual",
          color: "#ED7D31",
          number: "24"
        },
        {
          type: "icon-operations-manual",
          color: "#0070C0",
          number: "73"
        },
        {
          type: "icon-systems-documentation",
          color: "#7F7F7F",
          number: "22"
        }
      ];


      this.buildChart(data);
    }, 2000);
  }

  buildChart(data) {

    console.log(data.length);
    for (var i = 0; i < data.length; i++) {0
      document.querySelector('#' + data[i].type + '> #number > text').textContent = data[i].number;
      (document.querySelector('#' + data[i].type + '> #icon') as any).style.fill = data[i].color;
    }
  }

}
