/**
 * Chart settings used in complete application
 */
export const chartSettings = {
  doughnut: {
    theme: {
      primary: '#4871b7',
      secondary: '#e1e2e3',
    },
    typography: {
      textStyle: '24px Roboto',
      iconStyle: '40px Flaticon',
      textSuffixStyle: '12px Roboto'
    },
    backgroundColors: ['#7cc4d5', '#f79647', '#2a4d76', '#782c2b', '#5b7231', '#432f58', '#7e63a2', '#afc97b', 'rgb(255, 99, 132)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(231,233,237)'],
    textColor: 'rgba(255, 255, 255, 0.85)',
    legendColor: '#bbb'
  },
  // Summary page custom charts
  riskAndReturns: {
    riskBg: '#ffc000',
    cushionBg: '#ffff00',
    returnLightGreen: '#92d050',
    returnDarkGreen: '#339933',
    blackDiamond: '#1c1c1c',
    redDiamond: '#ff1b1b'
  },
  // Commitment Excess Ins
  commitmentExcessIns: {
    armCommit: '#339933',
    distCommit: '#558ed5',
    excessIns: '#ffc000'
  }
};
