import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class ExportOpportunitiesToCsv extends LightningElement {
    @api recordId;

    

    error;
    records;
    
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Opportunities',
        fields: [ 'Opportunity.Id', 'Opportunity.Name', 'Opportunity.StageName'],
        sortBy: ['Opportunity.Name'],
        pageSize: 1999
    })


    listInfo({ error, data }) {
        if (data) {
            //console.log('recordId '+ recordId);
            console.log(data.records);
            this.records = data.records;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    exportToCSV() {
        console.log('export to csv'); 
        console.log(JSON.stringify(this.error));
        console.log(JSON.stringify(this.records));

        if(this.error){
            // Show error toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'An Error has occured!',
                    message: this.error.body.message,
                    variant: 'error',
                })
            );
            return;
        }

        if(this.records.length === 0){
            // Show message that no opportunities exist
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Data Not Found!',
                    message: 'There are no opportunities to export related to this account record.',
                    variant: 'warning',
                })
            );
            return;
        }
        // Prepare CSV content
        let csvContent = 'Opportunity Id, Opportunity Name, Stage Name\n';
        this.records.forEach(record => {
            // 
            let opp_id = record.fields.Id.value;
            let opp_name = record.fields.Name.value;
            let stage_name = record.fields.StageName.value === null ? "" : record.fields.StageName.value;
            
            csvContent += `"${opp_id}","${opp_name}","${stage_name}"\n`;
        });

        console.log('csvContent::', csvContent);

        // Create Blob and download CSV file

        // Creating anchor element to download
        let downloadElement = document.createElement('a');

        // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = 'Opportunities.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click();

        // Show success toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'CSV exported successfully',
                variant: 'success',
            })
        );
    }
}