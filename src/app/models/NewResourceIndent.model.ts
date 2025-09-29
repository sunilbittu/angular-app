export class NewResourceIndent{
    public resourceTitle : string = '';
    public projectName : string = '';
    public numberRequired : number = 0;
    public requestReason : string = '';
    public hiringStartDate : string = '';
    public jobDescription : string = '';
    public fileName : string = '';
    public filePath : string = '';

    public constructor(init?: Partial<NewResourceIndent>) {
        Object.assign(this, init);
    }
}