import React from 'react';
import './Panel.scss';
import DraggableBorder from '../DraggableBorder/DraggableBorder';

export type PanelProps = {}

const Panel: React.FunctionComponent<PanelProps> = ({}) => {

    return <article className={'Panel'}>
        <aside className={'Panel__addition'}/>

        <DraggableBorder target={'#panelSidebar'} horizontal={true}/>

        <aside id="panelSidebar" className={'Panel__sidebar l-column'}>
            <div id="stretch" className={'l-stretch'}></div>

            <DraggableBorder target={'#panelSidebar3'} horizontal={false}/>
            <section id="panelSidebar3" className={'Panel__main__bottom'}></section>

        </aside>

        <main className={'Panel__main l-column'}>
            <div className={'Panel__main__top l-stretch'}></div>

            <DraggableBorder target={'#panelSidebar2'} horizontal={false}/>
            <section id="panelSidebar2" className={'Panel__main__bottom'}></section>

            <DraggableBorder target={'#panelSidebar4'} horizontal={false}/>
            <section id="panelSidebar4" className={'Panel__main__bottom'}></section>

            <footer className={'Panel-footerWithConstantHeight'}>footer</footer>
        </main>

    </article>;
};

export default Panel;