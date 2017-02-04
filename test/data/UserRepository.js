import Repository from '../../src/Repository';
import FakeDatabase from './FakeDatabase';
import User from '../domain/User.js';

export default class UserRepository extends Repository {
    constructor(...args) {
        super(...args);

        this.database = new FakeDatabase();
    }

    toDbEntity(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }

    findById(id) {
        const user = new User({
            id,
            name: 'Foo',
            email: 'foo@bar.baz'
        });

        this.getUow().trackEntity(user);

        return user;
    }

    save(dbUser, transaction) {
        return Promise.resolve().then(() => this.database.save(dbUser));
    }
}
