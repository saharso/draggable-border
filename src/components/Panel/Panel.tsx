import React from 'react';
import './Panel.scss';
import DraggableBorder from '../DraggableBorder/DraggableBorder';

export type PanelProps = {}

const Panel: React.FunctionComponent<PanelProps> = ({}) => {

    return <article className={'Panel'}>
        <aside className={'Panel__addition'}/>

        <aside id="panelSidebar" className={'Panel__sidebar'}>blbalbl</aside>
        <DraggableBorder target={'#panelSidebar'} direction={'left-right'}/>

        <main className={'Panel__main'}></main>

    </article>;
};

export default Panel;