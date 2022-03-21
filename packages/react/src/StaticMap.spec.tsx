import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import { StaticMap } from './StaticMap';

test('renders', () => {
  const { container } = render(
    <StaticMap
      width={345}
      height={138}
      padding={[10, 10]}
      bbox={[-61.0698239073564793, -21.3991246364298995, -61.0529563571889184, -21.407334765312239]}
    />,
  );
  expect(container).toMatchSnapshot();
});
