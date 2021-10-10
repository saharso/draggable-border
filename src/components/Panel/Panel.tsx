import React from 'react';
import './Panel.scss';
import DraggableBorder from '../DraggableBorder/DraggableBorder';

export type PanelProps = {}

const Panel: React.FunctionComponent<PanelProps> = ({}) => {

    return <article className={'Panel'}>
        <aside className={'Panel__addition'}/>


        <DraggableBorder target={'#panelSidebar'} horizontal={true}/>
        <aside id="panelSidebar" className={'Panel__sidebar'}>blbalbl</aside>

        <main className={'Panel__main'}>
            <div className={'Panel__main__top'}></div>
            <DraggableBorder target={'#panelSidebar2'} horizontal={false}/>
            <footer id="panelSidebar2" className={'Panel__main__bottom'}>blbalbl</footer>
        </main>

    </article>;
};

export default Panel;