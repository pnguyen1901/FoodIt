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
interface ItemsComponentProps { }
type ItemsComponentType = NavigationComponent<ItemsComponentProps>;

interface ItemComponentProps { }
type ItemComponentType = NavigationComponent<ItemComponentProps>;

interface addItemComponentProps { }
type addItemComponentType = NavigationComponent<addItemComponentProps>;

interface SettingsComponentProps { }
type SettingsComponentType = NavigationComponent<SettingsComponentProps>;

interface AccountComponentProps { }
type AccountComponentType = NavigationComponent<AccountComponentProps>;