import { Component } from '@angular/core';
import { UserService, ShiftExchangeService } from '../../patients/services/patients.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit, ViewChild } from '@angular/core';
import { parse } from 'querystring';
import { single } from 'rxjs/operator/single';
import { PatientShiftModel } from '../../patients/models/models';
import { Timer } from 'ngx-countdown/components/timer';
import { DeprecatedCurrencyPipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-dashboard-workplace',
    templateUrl: './handoverrecords.component.html',
    styleUrls: ['./handoverrecords.component.less'],
    providers: [UserService, ShiftExchangeService],
})
export class HandoverRecordsComponent implements OnInit {
    visible = false;
    showText = "";
    loading;
    isCollapse;
    quickSearchTerm;
    status;
    q;
    quickSearchPatient;
    searchTerm;
     pagenumber=10;

    users: any[] = [
        { value: 'xiao', label: '付晓晓' },
        { value: 'mao', label: '周毛毛' }
    ];

    constructor(private userService: UserService,
        private shiftExchangeService: ShiftExchangeService,
        private _message: NzMessageService) {
        window.setInterval(
            () => this.currentdate = new Date()
            , 1000);
    }
    datetime_ = null;
    datetime_1 = null;
    newshift: PatientShiftModel = new PatientShiftModel();
    ngOnInit() {
        this.doquery();
    }
    public shiftexchanges;
    public _shiftexchanges;
    totalsize = 50;
    currentpage = 1;
    pagecount = 0;
    public currentdate: Date = new Date();

    single1 = '早班';
    single2 = '';

    single = '全部';
    options1 = [
        { value: '早班', label: '早班' },
        { value: '中班', label: '中班' },
        { value: '晚班', label: '晚班' },
    ];

    isVisible = false;
    isConfirmLoading = false;
    datetime = new Date();
    showModal = () => {
        const Hours = this.datetime.getMinutes() < 10 ? '0' + this.datetime.getMinutes() : this.datetime.getMinutes();
        const Minutes: number = Number(this.datetime.getHours() + "" + Hours);
        console.log(Minutes);
        if (730 <= Minutes && 1530 > Minutes) {
            this.single1 = '早班';
            //console.log(this.single1);
        } else if (1530 <= Minutes && 2230 > Minutes) {
            this.single1 = '中班';
            //console.log(this.single1);
        } else {
            this.single1 = '晚班';
            //console.log(this.single1);
        }
        this.isVisible = true;
    }

    handleCancel = (e) => {
        this.isVisible = false;
    }

    // 根据时间查询交接班记录
    selectbytime() {

        if (this.datetime_ != undefined && this.single != undefined) {
            let year: number = this.datetime_.getFullYear();
            let month: any = (this.datetime_.getMonth()) < 10 ? +'0' + (+ this.datetime_.getMonth() + 1).toString() : (this.datetime_.getMonth() + 1).toString();
            let day: any = this.datetime_.getDate() < 10 ? ('0' + this.datetime_.getDate().toString()) : this.datetime_.getDate().toString();
            let time: any = year + '-' + month + '-' + day;
            this.userService.getAllShiftExchanges(1, 10, time, this.single).subscribe(r => {
                this.totalsize = r['totalCount'];
                this.shiftexchanges = this._shiftexchanges = r && r['records'];
            });
        } else if (this.single != undefined) {
            this.userService.getAllShiftExchanges(1, 10, '', this.single).subscribe(r => {
                this.totalsize = r['totalCount'];
                this.shiftexchanges = this._shiftexchanges = r && r['records'];
            });
        } else if (this.datetime_ != undefined) {
            let year: number = this.datetime_.getFullYear();
            let month: any = (this.datetime_.getMonth()) < 10 ? + ('0' + this.datetime_.getMonth()).toString() : (this.datetime_.getMonth() + 1).toString();
            let day: any = this.datetime_.getDate() < 10 ? ('0' + this.datetime_.getDate().toString()) : this.datetime_.getDate().toString() + '0';
            let time: any = year + '-' + month + '-' + day;
            this.userService.getAllShiftExchanges(1, 10, time, '').subscribe(r => {
                this.totalsize = r['totalCount'];
                this.shiftexchanges = this._shiftexchanges = r && r['records'];
            });
        } else {
            this.userService.getAllShiftExchanges(1, 10, '', '').subscribe(r => {
                this.totalsize = r['totalCount'];
                this.shiftexchanges = this._shiftexchanges = r && r['records'];
            });
        }

    }
    // 删除交班记录
    ondeleteExchange(id: any) {
        if (confirm('确定要删除吗？')) {
            this.userService.deleteShiftExchange(id).subscribe(r => {
                if (r['status'] == 1) {
                    this.showNotice("删除成功！")
                    this.doquery();
                }
            });
        }
    }
    doquery() {
        this.userService.getAllShiftExchanges(1, 10, '', '').subscribe(r => {
            this.totalsize = r['totalCount'];
            this.shiftexchanges = this._shiftexchanges = r && r['records'];

            
        });
    }

    loadmore(){
        if(this.pagenumber>=this.totalsize){
            this._message.info('数据已全部加载完毕。');
        }
        else{
        this.pagenumber+=10;
        this.userService.getAllShiftExchanges(1,this.pagenumber,'','').subscribe(r=>{
            this.totalsize=r['totalCount'];
            this.shiftexchanges=this._shiftexchanges=r&&r['records'];
        });
    }
    }
    npicc(date_: any) {

        if (this.datetime_ != undefined && this.single != undefined) {
            let year: number = this.datetime_.getFullYear();
            let month: any = (this.datetime_.getMonth()) < 10 ? +'0' + (+ this.datetime_.getMonth() + 1).toString() : (this.datetime_.getMonth() + 1).toString();
            let day: any = this.datetime_.getDate() < 10 ? ('0' + this.datetime_.getDate().toString()) : this.datetime_.getDate().toString();
            let time: any = year + '-' + month + '-' + day;
            this.userService.getAllShiftExchanges(date_, 10, time, this.single).subscribe(r => {
                this.totalsize = r['totalCount'];
                this.shiftexchanges = this._shiftexchanges = r && r['records'];
                // console.log(time);
            });
        } else if (this.single != undefined) {
            this.userService.getAllShiftExchanges(date_, 10, '', this.single).subscribe(r => {
                this.totalsize = r['totalCount'];
                this.shiftexchanges = this._shiftexchanges = r && r['records'];
            });
        } else if (this.datetime_ != undefined) {
            let year: number = this.datetime_.getFullYear();
            let month: any = (this.datetime_.getMonth()) < 10 ? + ('0' + this.datetime_.getMonth()).toString() : (this.datetime_.getMonth() + 1).toString();
            let day: any = this.datetime_.getDate() < 10 ? ('0' + this.datetime_.getDate().toString()) : this.datetime_.getDate().toString() + '0';
            let time: any = year + '-' + month + '-' + day;
            this.userService.getAllShiftExchanges(date_, 10, time, '').subscribe(r => {
                this.totalsize = r['totalCount'];
                this.shiftexchanges = this._shiftexchanges = r && r['records'];
            });
        } else {
            this.userService.getAllShiftExchanges(date_, 10, '', '').subscribe(r => {
                this.totalsize = r['totalCount'];
                this.shiftexchanges = this._shiftexchanges = r && r['records'];
            });
        }
    }
    model = '';
    selectedDoctor = '';
    doctorSearch: any;
    onDoctorSearch(event: string): void {
        this.shiftExchangeService.getDoctor(event).subscribe(res => {
            this.doctorSearch = res; // this._doctorSearch;
        });
    }
    stat:any;
    // 创建交接班
    handleOk() {

        var currentdate = new Date();
        var date = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        this.newshift.successionterCode = this.model['doctorCode'];
        this.newshift.successionterName = this.model['doctorName'];
        if(this.datetime_1!=null){
            let year: number = this.datetime_1.getFullYear();
        let month: any = (this.datetime_1.getMonth()) < 10 ? +'0' + (+ this.datetime_1.getMonth() + 1).toString() : (this.datetime_1.getMonth() + 1).toString();
        let day: any = this.datetime_1.getDate() < 10 ? ('0' + this.datetime_1.getDate().toString()) : this.datetime_1.getDate().toString();
        let time: any = year + '-' + month + '-' + day +' '+ date;
        this.newshift.shiftExchangeDateTime = time;
    }
        this.newshift.station=this.single2;
        this.newshift.shiftName = this.single1;
        this.newshift.station=this.single2;
        this.userService.addHandShiftExchange(this.newshift).subscribe(x => {
             console.log(x);
             this.stat=x;
            if (x['status'] == 1) {
               
                if ( x["data"]['station'] == "抢/留") {
                    console.log(x["data"]['shifterCode'],);
                    this.userService.getShiftExchangeAndParient( x["data"]['shifterCode'],  x["data"]['station']).subscribe(x=>{});
                }
                this.showNotice("添加成功!!")
                //alert('添加成功');
            }
            else { this.showNotice(x['desc']) }
            this.doquery();
            this.isVisible = false; 
        });
        
        
    }
    onchangeDoctor(event: string): void {
        for (let i in this.doctorSearch) {
            if (this.doctorSearch[i].doctorName == event) {
                this.model = this.doctorSearch[i];
            }
        }
    }

    onKeyWordChange(event: any) {
        console.log("come in" + this.searchTerm);
        let _list = this._shiftexchanges.filter(f => {
            let flag = ((f.shiftName && f.shiftName.indexOf(this.searchTerm) != -1) ||
                (f.shifterCode && f.shifterCode.indexOf(this.searchTerm) != -1));
            if (flag) {
                return true;
            }
            else {
                return false;
            }
        });
        this.shiftexchanges = _list;
    }
    //提示框
    showNotice(text: string) {
        this.showText = text;
        this.visible = true;
    }
    clickMe() { this.visible = false; }
}
