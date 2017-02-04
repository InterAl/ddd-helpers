export default class FakeDatabase {
    constructor() {
        this.saved = [];
    }

    save(entity) {
        this.saved.push(entity);
        return Promise.resolve();
    }
}
