import User from './domain/User';
import UserRepository from './data/UserRepository';
import UoW from '../src/UnitOfWork';
import {assert} from 'chai';

describe('unit of work', () => {
    let userRepository, uow;

    function createTransaction() {
        return Promise.resolve({
            commit: () => Promise.resolve(),
            rollback: () => Promise.resolve()
        });
    }

    function getEntityRepository(entity) {
        return userRepository;
    }

    beforeEach(() => {
        uow = UoW(createTransaction, getEntityRepository)();
        userRepository = new UserRepository(() => uow);
    });

    it('change and save entity', done => {
        let user = userRepository.findById(42);
        user.updateName('Alon');
        user.updateEmail('alon@gmail.com');

        uow.commit()
           .then(() => {
               assert.deepEqual(userRepository.database.saved[0], {
                   id: 42,
                   name: 'Alon',
                   email: 'alon@gmail.com'
               });
           })
           .then(() => done())
           .catch(done)
    });

    it('unchanged entities are not saved', done => {
        let user = userRepository.findById(42);

        uow.commit()
           .then(() => {
               assert.deepEqual(userRepository.database.saved, [])
           })
           .then(() => done())
           .catch(done);
    });

    it('new entities are saved, even if not mutated after tracking', done => {
        let user = new User({id: '1', name: 'gg', email: 'gg@gmail.com'});

        uow.trackEntity(user, {isNew: true});

        uow.commit()
           .then(() => {
               assert.deepEqual(userRepository.database.saved, [{
                   id: '1',
                   name: 'gg',
                   email: 'gg@gmail.com'
               }]);
           })
           .then(() => done())
           .catch(done);
    });
});
