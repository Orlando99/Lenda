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
    component: 'FSAComponent'
  },
  livestock: {
    key: 'LSK',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'LivestockComponent'
  },
  storedCrop: {
    key: 'SCP',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'StoredCropComponent'
  },
  equipment: {
    key: 'EQP',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'EquipmentComponent'
  },
  realestate: {
    key: 'RET',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'RealEstateComponent'
  },
  other: {
    key: 'OTR',
    source: 'LoanCollateral',
    sourceKey: 'Collateral_Category_Code',
    component: 'OthersComponent'
  },
  contacts: {
    key: 'TBD4',
    source: '',
    sourceKey: 'TBD'
  },
  marketingContracts: {
    key: '',
    source: 'LoanMarketingContracts',
    sourceKey: ''
  }
}
