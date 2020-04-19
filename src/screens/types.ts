interface NavigationComponentProps {
    componentId: string;
}
interface NavigationComponentOptions {
    options?: (passProps?: Record<string, any>) => object;
}

type NavigationComponent<P> =
    React.FC<P & NavigationComponentProps> & NavigationComponentOptions;

// ====================================================================
// ====================================================================
interface ItemComponentProps { }
type ItemComponentType = NavigationComponent<ItemComponentProps>;

interface addItemComponentProps { }
type addItemComponentType = NavigationComponent<addItemComponentProps>;
