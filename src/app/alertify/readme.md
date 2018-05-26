Usage:----


/*    alert  box */
this.alertifyService.alert('test','this is test alert').subscribe((res:any)=>{
        console.log('testAlert',res);

    })
/*    Confirm  box */
this.alertifyService.confirm('test','this is test alert').subscribe((res:any)=>{
      console.log('testConfirm',res);
    })