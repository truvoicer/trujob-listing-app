export class PageService {
    static REQUIRED_FIELDS = [
        'id', 
        'title', 
        'permalink', 
        'view'
    ];
    static validatePageData(data: any): boolean {
        return true;
    }
}