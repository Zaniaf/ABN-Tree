const chai   = require('chai');
const expect = chai.expect;

const convertTools = require('../backend/convert');

describe('Convert tools', function() {
    it('should return an empty array', function() {

        const result = convertTools.convertToTree([]);

        expect(result).to.deep.equal([]);
    });

    it('should convert the linear data to nested tree structure', function() {
        let linearData =[
            {
                "name":"A",
                "description":"This is a description of A",
                "parent":""
            },
            {
                "name":"B",
                "description":"This is a description of B",
                "parent":"A"
            },
            {
                "name":"B-1",
                "description":"This is a description of B-1",
                "parent":"B"
            },
            {
                "name":"B-2",
                "description":"This is a description of B-2",
                "parent":"B"
            },
            {
                "name":"B-2-a",
                "description":"This is a description of B-2-a",
                "parent":"B-2"
            },
        ];

        const result = convertTools.convertToTree(linearData);
        convertTools.cleanUpParentProperty(result);
        expect(result).to.deep.equal([{
            name: 'A',
            description: 'This is a description of A',
            parent: undefined,
            children: [{
                name: 'B',
                description: 'This is a description of B',
                parent: 'A',
                children: [{
                    name: 'B-1',
                    description: 'This is a description of B-1',
                    parent: 'B',
                    children: []
                }, {
                    name: 'B-2',
                    description: 'This is a description of B-2',
                    parent: 'B',
                    children: [{
                        name: 'B-2-a',
                        description: 'This is a description of B-2-a',
                        parent: 'B-2',
                        children: []

                    }]
                }]
            }]
        }]);
    });
});
