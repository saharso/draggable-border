import React from 'react';
import './Panel.scss';
import DraggableBorder from '../DraggableBorder/DraggableBorder';

export type PanelProps = {}

const Panel: React.FunctionComponent<PanelProps> = ({}) => {

    return <article className={'Panel'}>
        <aside className={'Panel__addition'}/>


        <DraggableBorder target={'#panelSidebar'} horizontal={true}/>
        <aside id="panelSidebar" className={'Panel__sidebar l-column'}>
            <div className={'l-stretch'}></div>

            <DraggableBorder target={'#panelSidebar3'} horizontal={false}/>
            <footer id="panelSidebar3" className={'Panel__main__bottom'}>blbalbl</footer>

        </aside>

        <main className={'Panel__main l-column'}>
            <div className={'Panel__main__top l-stretch'}></div>

            <DraggableBorder target={'#panelSidebar2'} horizontal={false}/>
            <footer id="panelSidebar2" className={'Panel__main__bottom'}>blbalbl</footer>

            <DraggableBorder target={'#panelSidebar4'} horizontal={false}/>
            <footer id="panelSidebar4" className={'Panel__main__bottom'}>blbalbl</footer>
        </main>

    </article>;
};

export default Panel;