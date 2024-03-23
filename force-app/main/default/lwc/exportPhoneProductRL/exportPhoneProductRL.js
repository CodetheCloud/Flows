import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPhoneNumbers from '@salesforce/apex/LWCUtilityController.getPhoneNumbers';

    // datatable columns
const cols = [
        {label: 'Name',fieldName: 'Name'}, 
        {label: 'Contract Start Date',fieldName: 'Contract_Start_Date__c'},
        {label: 'Contract End Date',fieldName: 'Contract_End_Date__c'}, 
        {label: 'PIN Number',fieldName: 'Pin_number__c'}, 
        {label: 'SIM Number',fieldName: 'Sim_Number__c'}, 
    ];

export default class ExportPhoneProductRL extends LightningElement {

    @api recordId;
    error;
    records;
    @track columns = cols;
    @track data; 
    



    @wire (getPhoneNumbers,{phoneProductId: '$recordId'}) records({error, data}){
        if(data){
            this.data = data;
            console.log(data); 
        } else if(error){
            this.error = error;
            console.log(error);
        }
    };




    exportToCSV() {
        let rowEnd = '\n';
        let csvString = '';
        // this set elminates the duplicates if have any duplicate keys
        let rowData = new Set();
       
        console.log('records '+ this.records); 
        console.log('data '+ this.data); 

        // getting keys from data
        this.data.forEach(function (record) {
            Object.keys(record).forEach(function (key) {
                rowData.add(key);
            });
        });

        // Array.from() method returns an Array object from any object with a length property or an iterable object.
        rowData = Array.from(rowData);

        // splitting using ','
        csvString += rowData.join(',');
        csvString += rowEnd;

        // main for loop to get the data based on key value
        for(let i=0; i < this.data.length; i++){
            let colValue = 0;
 
            // validating keys in data
            for(let key in rowData) {
                if(rowData.hasOwnProperty(key)) {
                    // Key value 
                    // Ex: Id, Name
                    let rowKey = rowData[key];
                    // add , after every value except the first.
                    if(colValue > 0){
                        csvString += ',';
                    }
                    // If the column is undefined, it as blank in the CSV file.
                    console.log('~~'+ this.data[i][rowKey]);
                    let value = this.data[i][rowKey] === undefined ? '' : ''+this.data[i][rowKey].toString();
                    console.log('17Jan debug = ' + value);

                    csvString += '"'+ value +'"';
                    console.log('csvString = '+ csvString);
                    colValue++;
                }
            }
            csvString += rowEnd;
        }

        if(true){
            // Show message that no opportunities exist
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!',
                    message: 'Record found successfully.',
                    variant: 'success',
                })
            );
        }

         // Creating anchor element to download
         let downloadElement = document.createElement('a');
 
         // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
         downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);

         downloadElement.target = '_self';
         // CSV File Name
         downloadElement.download = 'Contact Data.csv';
         // below statement is required if you are using firefox browser
         document.body.appendChild(downloadElement);
         // click() Javascript function to download CSV file
         downloadElement.click(); 


    

    }



}