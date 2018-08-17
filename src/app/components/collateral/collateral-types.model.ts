import { AssociationTypeCode } from "../../models/loanmodel";

export default {
  lineHolder: {
    key: AssociationTypeCode.LienHolder,
    source: 'Association',
    sourceKey: 'Assoc_Type_Code'
  },
  buyer: {
    key: AssociationTypeCode.Buyer,
    source: 'Association',
    sourceKey: 'Assoc_Type_Code'
  },
  guarantor: {
    key: AssociationTypeCode.Guarantor,
    source: 'Association',
    sourceKey: 'Assoc_Type_Code'
  },
  collaterlData: {
    key: 'TBD3',
    source: 'LoanCollateral',
    sourceKey: 'TBD'
  },
  fsa: {
    key: 'FSA',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'FSAComponent',
    pk: 'Collateral_ID',
    colKey: 'Collateral_Description'
  },
  livestock: {
    key: 'LSK',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'LivestockComponent',
    pk: 'Collateral_ID',
    colKey: 'Collateral_Description'
  },
  storedCrop: {
    key: 'SCP',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'StoredCropComponent',
    pk: 'Collateral_ID',
    colKey: 'Collateral_Description'
  },
  equipment: {
    key: 'EQP',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'EquipmentComponent',
    pk: 'Collateral_ID',
    colKey: 'Collateral_Description'
  },
  realestate: {
    key: 'RET',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'RealEstateComponent',
    pk: 'Collateral_ID',
    colKey: 'Collateral_Description'
  },
  other: {
    key: 'OTR',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'OthersComponent',
    pk: 'Collateral_ID',
    colKey: 'Collateral_Description'
  },
  contacts: {
    key: 'TBD4',
    source: '',
    sourceKey: 'TBD'
  },
  marketingContracts: {
    key: '',
    source: 'LoanMarketingContracts',
    sourceKey: '',
    component: 'MarketingContractComponent',
    pk: 'Contract_ID',
    colKey: 'Category'
  }
}
