import React from 'react';
import './Demo.scss';
import DraggableBorder from '../DraggableBorder/DraggableBorder';

export type PanelProps = {}

const Demo: React.FunctionComponent<PanelProps> = ({}) => {

    return <>
        <DraggableBorder target={'#panelSidebar2'} horizontal={false}/>
        <DraggableBorder target={'#panelSidebar'} horizontal={true}/>
        <DraggableBorder target={'#panelSidebar3'} horizontal={false}/>
        <DraggableBorder target={'#panelSidebar4'} horizontal={false}/>
        <DraggableBorder target={'#panelSidebar5'} horizontal={true}/>

        <article className={'Panel'}>

            <aside className={'Panel__addition'}></aside>

            <aside id="panelSidebar" className={'Panel__sidebar l-column'}>
                <div id="stretch" className={'l-stretch'}></div>

                <section id="panelSidebar3" className={'Panel__main__bottom'}></section>

            </aside>

            <main className={'Panel__main l-column'}>
                <div className={'Panel__main__top l-stretch'}></div>

                <section id="panelSidebar2" className={'Panel__main__bottom'}>
                    <section id="panelSidebar5" style={{width: '12em'}}></section>
                    <div></div>
                </section>

                <section id="panelSidebar4" className={'Panel__main__bottom'}></section>

                <footer className={'Panel-footerWithConstantHeight'}>footer</footer>
            </main>

        </article>
    </>;
};

export default Demo;