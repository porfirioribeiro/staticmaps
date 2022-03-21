import { mount } from '@vue/test-utils';
import StaticMapVue from './StaticMap.vue';

test('renders', () => {
  const wrapper = mount(StaticMapVue, {
    props: {
      options: {
        width: 345,
        height: 138,
        padding: [10, 10],
        bbox: [-61.0698239073564793, -21.3991246364298995, -61.0529563571889184, -21.407334765312239],
      },
    },
  });
  expect(wrapper.html()).toMatchSnapshot();
});
