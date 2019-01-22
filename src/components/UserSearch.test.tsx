import React from 'react';
import { shallow } from 'enzyme';
import { UserSearch } from "./UserSearch"

const USER_NAME = 'rickiesmeeoefoth'

it('renders search', () => {
    const wrapper = shallow(<UserSearch />);
    expect(wrapper.find('input').exists()).toEqual(true);
});

it('should not crash when submitted', () => {
    const wrapper = shallow(<UserSearch />);

    wrapper.find('input').simulate('change', {
        currentTarget: { value: USER_NAME },
        preventDefault: () => undefined
    })

    wrapper.instance().handleSubmit = function () {
        expect(this.username).toEqual(USER_NAME)
    }

    wrapper.find("form").simulate('submit', { preventDefault: () => undefined })

});