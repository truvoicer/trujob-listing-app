export class ClassBuilder {
    style = {};

    buildClass(classes) {
        return classes.join(' ');
    }
    
    static getInstance() {
        return new this();
    }
}