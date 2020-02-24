import * as React from "react";
import {shallow} from "enzyme";
import {App} from "../App";

describe("App", () => {
    it('should say hello', () => {
        const component = shallow(<App/>);

        expect(component.find("div").text()).toEqual("Hello World!")
    });
});