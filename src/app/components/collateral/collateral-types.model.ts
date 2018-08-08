export default {
  lineHolder: {
    key: 'TBD1',
    source: '',
    sourceKey: ''
  },
  buyer: {
    key: 'BUY',
    source: 'Association',
    sourceKey: 'Assoc_Type_Code'
  },
  guarantor: {
    key: 'TBD2',
    source: '',
    sourceKey: 'TBD'
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
