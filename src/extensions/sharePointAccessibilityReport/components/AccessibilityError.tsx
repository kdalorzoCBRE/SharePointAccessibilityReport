export class AccessibilityError {
    constructor(public runId: string, public runDate: Date, public issueId: string, public impact: string, public description: string,
        public summary: string, public html: string, public itemId: string, public message: string) { }

    public toJSON() {
        return {
            'RunID': this.runId,
            'Page': {
                Description: "Description",
                Url: "https://github.com/SharePoint/PnP-JS-Core/issues/682"
            },
            'RunDate': this.runDate,
            'IssueId': this.issueId,
            'Impact': this.impact,
            'Description': this.description,
            'Summary': this.summary,
            'HTML': this.html,
            'ItemId': this.itemId,
            'Message': this.message
        }
    }
}