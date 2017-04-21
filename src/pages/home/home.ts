import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment-timezone';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  TIMEZONE = 'Asia/Kolkata';
  DATEFORMAT = 'ddd,hh:mm A';

  staff1 = 'John';
  staff2 = 'Albert';
  startDate = new Date().toISOString();
  staff = [];
  shifts: any[] = [];
  days: any[] = [];
  /*[{
    day:'Saturday',
    shifts:[{from:'07:00 AM',to:'07:00 PM',staff:'Vimal'},{from:'07:00 PM',to:'07:00 AM',staff:'Anil'}]
  }]*/

  initVariables() {
    this.staff = [{
      name: this.staff1,
      shifts: []
    }, {
      name: this.staff2,
      shifts: []
    }];
    this.days = [];
    this.shifts = [];
  }


  shiftDef = [{
    from: '07:00 AM',
    to: '07:00 PM',
    hours: {
      Default: 12
    },
    switchDay: '',
    switch: false
  }, {
    from: '07:00 PM',
    to: '07:00 AM',
    hours: {
      Saturday: 24,
      Sunday: 24,
      Default: 12
    },
    switchDay: 'Saturday',
    switch: false
  }];

  constructor(public navCtrl: NavController) {
  }

  createSchedule() {
    //create schedule for 30 shifts;
    //start with 1st Staff ( Anil )
    //start from tomorrow's 7AM;
    let staffIndex = 0;
    let runningDate = new moment().tz(this.TIMEZONE).add(1, 'day');
    for (var index = 0; index < 30; index++) {
      runningDate.add(1, 'day');

      this.shiftDef.forEach(shiftDef => {
        console.log(runningDate.format('DD-MM-YY '))
        let shiftDateTime = new moment(runningDate.format('DD-MM-YY ') + shiftDef.from, 'DD-MM-YY hh:mm A').tz(this.TIMEZONE);
        this.staff[staffIndex].shifts.push({
          from: new moment(shiftDateTime),
          to: new moment(shiftDateTime.add(shiftDef.hours, 'hours'))
        });
        if (runningDate.format('dddd') === shiftDef.switchDay && shiftDef.switch) {
          //continue with same staff;
        } else {
          staffIndex = (staffIndex == 0) ? 1 : 0;
        }
      })

    }
  }

  createSchedule2() {
    let staffIndex = 0;
    let runningDate = new moment().tz(this.TIMEZONE).add(1, 'day');
    for (var index = 0; index < 30; index++) {
      runningDate.add(1, 'day');

      this.shiftDef.forEach(shiftDef => {


        let shiftStart = new moment(runningDate.format('DD-MM-YY ') + shiftDef.from, 'DD-MM-YY hh:mm A');

        this.shifts.push({
          from: new moment(shiftStart),
          to: new moment(shiftStart.add(shiftDef.hours, 'hours')),
          staff: this.staff[staffIndex].name
        });
        if (runningDate.format('dddd') === shiftDef.switchDay && shiftDef.switch) {
          //continue with same staff;
        } else {
          staffIndex = (staffIndex == 0) ? 1 : 0;
        }
      })

    }
  }

  createSchedule3(startDate, staff1, staff2) {
    this.initVariables();
    let staffIndex = 0;
    let runningDate = new moment(startDate).tz(this.TIMEZONE);

    if (!this.days.length) {
      runningDate = new moment(runningDate.format('DD-MM-YY ') + this.shiftDef[0].from, 'DD-MM-YY hh:mm A');
    }

    for (var index = 0; index < 30; index++) {
      this.days.push({
        day: new moment(runningDate).startOf('day'),
        shifts: []
      });
      for (let shiftDef of this.shiftDef) {
        
        if (shiftDef.from != runningDate.format('hh:mm A')) {
          continue;
        }

        let shift: any = {
          staff: this.staff[staffIndex].name
        };
        let shiftStart = new moment(runningDate);
        shift.from = new moment(shiftStart);
        let shiftStartDay = shiftStart.format('dddd');
        let shiftHours = shiftDef.hours[shiftStartDay] || shiftDef.hours.Default;
        let shiftEnd = new moment(shiftStart.add(shiftHours, 'hours'));
        shift.to = new moment(shiftEnd);
        this.days[index].shifts.push(shift);
        runningDate = new moment(shiftEnd);
        console.log(runningDate.format('dddd, hh:mm A'))
        if (runningDate.format('dddd') === shiftDef.switchDay && shiftDef.switch) {
          //continue with same staff;
        } else {
          staffIndex = (staffIndex == 0) ? 1 : 0;
        }
      }
    }
  }
}
