
import { assert, expect } from 'chai';
import { newTx, loadDescription } from './helper';
import { buildContractClass, VerifyError, buildTypeClasses } from '../src/contract';
import { Bytes, } from '../src/scryptTypes';


const jsonDescr = loadDescription('mixedstruct_desc.json');
const MixedStruct = buildContractClass(jsonDescr);
const { Block, Person, Token, Bsver } = buildTypeClasses(jsonDescr);

const mixedDescr = loadDescription('mixed_desc.json');

const MixedArrayAndStruct = buildContractClass(mixedDescr);
const { A2, NEW_ST2, NEW_ST3, ST, ST2, ST3 } = buildTypeClasses(mixedDescr);

describe('MixedStruct  test', () => {

  describe('check MixedStruct', () => {
    let mixedStruct, result;

    before(() => {
      mixedStruct = new MixedStruct(new Bsver({
        name: new Bytes('6666'),
        friend: new Person({
          name: new Bytes('7361746f736869206e616b616d6f746f'),
          addr: new Bytes('6666'),
          isMale: true,
          age: 33,
          blk: new Block({
            time: 10000,
            hash: new Bytes('68656c6c6f20776f726c6421'),
            header: new Bytes('1156'),
          })
        }),
        tokens: [new Token({
          id: new Bytes('0001'),
          createTime: 1000000
        }), new Token({
          id: new Bytes('0002'),
          createTime: 1000001
        }), new Token({
          id: new Bytes('0003'),
          createTime: 1000002
        })]
      }));

    });



    it('should success when call unlock', () => {
      result = mixedStruct.unlock(new Person({
        name: new Bytes('7361746f736869206e616b616d6f746f'),
        addr: new Bytes('68656c6c6f20776f726c6421'),
        isMale: true,
        age: 33,
        blk: new Block({
          time: 10000,
          hash: new Bytes('68656c6c6f20776f726c6420'),
          header: new Bytes('1156'),
        })
      })).verify()
      expect(result.success, result.error).to.be.true
    });


    it('should fail when name error', () => {
      result = mixedStruct.unlock(new Person({
        name: new Bytes('11'),
        addr: new Bytes('68656c6c6f20776f726c6421'),
        isMale: true,
        age: 33,
        blk: new Block({
          time: 10000,
          hash: new Bytes('68656c6c6f20776f726c6420'),
          header: new Bytes('1156'),
        })
      })).verify()
      expect(result.success, result.error).to.be.false
    });


    it('should fail when time error', () => {
      result = mixedStruct.unlock(new Person({
        name: new Bytes('11'),
        addr: new Bytes('68656c6c6f20776f726c6421'),
        isMale: true,
        age: 33,
        blk: new Block({
          time: 10001,
          hash: new Bytes('68656c6c6f20776f726c6420'),
          header: new Bytes('1156'),
        })
      })).verify()
      expect(result.success, result.error).to.be.false
    });


    it('should fail when missing member name', () => {

      expect(() => {
        result = mixedStruct.unlock(new Person({
          addr: new Bytes('68656c6c6f20776f726c6421'),
          isMale: true,
          age: 33,
          blk: new Block({
            time: 10001,
            hash: new Bytes('68656c6c6f20776f726c6420'),
            header: new Bytes('1156'),
          })
        })).verify()

      }).to.throw('argument of type struct Person missing member name');
    });


    it('should fail when missing member hash', () => {

      expect(() => {
        result = mixedStruct.unlock(new Person({
          name: new Bytes('7361746f736869206e616b616d6f746f'),
          addr: new Bytes('68656c6c6f20776f726c6421'),
          isMale: true,
          age: 33,
          blk: new Block({
            time: 10001,
            header: new Bytes('1156'),
          })
        })).verify()

      }).to.throw('argument of type struct Block missing member hash');
    });


    it('struct Bsver property tokens should be struct Token {}[3]', () => {

      expect(() => {
        new MixedStruct(new Bsver({
          name: new Bytes('6666'),
          friend: new Person({
            name: new Bytes('7361746f736869206e616b616d6f746f'),
            addr: new Bytes('6666'),
            isMale: true,
            age: 33,
            blk: new Block({
              time: 10000,
              hash: new Bytes('68656c6c6f20776f726c6421'),
              header: new Bytes('1156'),
            })
          }),
          tokens: [new Token({
            id: new Bytes('0001'),
            createTime: 1000000
          }), new Token({
            id: new Bytes('0002'),
            createTime: 1000001
          })]
        }));

      }).to.throw('checkArray fail, struct Bsver property tokens should be struct Token {}[3]');


      expect(() => {
        new MixedStruct(new Bsver({
          name: new Bytes('6666'),
          friend: new Person({
            name: new Bytes('7361746f736869206e616b616d6f746f'),
            addr: new Bytes('6666'),
            isMale: true,
            age: 33,
            blk: new Block({
              time: 10000,
              hash: new Bytes('68656c6c6f20776f726c6421'),
              header: new Bytes('1156'),
            })
          }),
          tokens: [new Token({
            id: new Bytes('0001'),
            createTime: 1000000
          }), new Token({
            id: new Bytes('0002'),
            createTime: 1000001
          }), new Token({
            id: new Bytes('0003'),
            createTime: 1000002
          }), new Token({
            id: new Bytes('0004'),
            createTime: 1000003
          })]
        }));

      }).to.throw('checkArray fail, struct Bsver property tokens should be struct Token {}[3]');


      expect(() => {
        new MixedStruct(new Bsver({
          name: new Bytes('6666'),
          friend: new Person({
            name: new Bytes('7361746f736869206e616b616d6f746f'),
            addr: new Bytes('6666'),
            isMale: true,
            age: 33,
            blk: new Block({
              time: 10000,
              hash: new Bytes('68656c6c6f20776f726c6421'),
              header: new Bytes('1156'),
            })
          }),
          tokens: new Token({
            id: new Bytes('0001'),
            createTime: 1000000
          })
        }));
      }).to.throw('struct Bsver property tokens should be struct Token {}[3]');

    });

  });

  describe('check mixed', () => {
    let mixed, result;

    before(() => {
      mixed = new MixedArrayAndStruct();
    });


    it('unlock mixed should success', () => {
      result = mixed.unlock(1).verify()
      expect(result.success, result.error).to.be.true
    });

    it('unlock mixed should fail', () => {
      result = mixed.unlock(0).verify()
      expect(result.success, result.error).to.be.false
    });

    it('unlock mixed should fail', () => {
      result = mixed.unlock(4).verify()
      expect(result.success, result.error).to.be.false
    });

  })
});