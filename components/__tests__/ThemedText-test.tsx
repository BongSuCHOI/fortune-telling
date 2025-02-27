import * as React from 'react';
import renderer from 'react-test-renderer';

import { Typography } from '../Typography.js';

it(`renders correctly`, () => {
    const tree = renderer.create(<Typography>Snapshot test!</Typography>).toJSON();

    expect(tree).toMatchSnapshot();
});
