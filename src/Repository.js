export default class Repository {
    constructor(getUow) {
        this.getUow = getUow;
    }

    trackEntity(entity) {
        this.getUow().trackEntity(entity);
    }
}
