import * as React from 'react';
import renderer from 'react-test-renderer';

import { Typography } from '../ui/Typography.js';

it(`renders correctly`, () => {
    const tree = renderer.create(<Typography text="Snapshot test!" />).toJSON();

    expect(tree).toMatchSnapshot();
});
