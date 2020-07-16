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
interface LogInComponentProps { }
type LogInComponentType = NavigationComponent<LogInComponentProps>;

interface ItemsComponentProps { }
type ItemsComponentType = NavigationComponent<ItemsComponentProps>;

interface ItemComponentProps { }
type ItemComponentType = NavigationComponent<ItemComponentProps>;

interface ReminderComponentProps { }
type ReminderComponentType = NavigationComponent<ReminderComponentProps>;

interface addItemComponentProps { 
    expiration_date: Date
}
type addItemComponentType = NavigationComponent<addItemComponentProps>; // type can extend

interface CameraComponentProps { }
type CameraComponentType = NavigationComponent<CameraComponentProps>;

interface SettingsComponentProps { }
type SettingsComponentType = NavigationComponent<SettingsComponentProps>;

interface AccountComponentProps { }
type AccountComponentType = NavigationComponent<AccountComponentProps>;

interface ShareItemComponentProps { }
type ShareItemComponentType = NavigationComponent<ShareItemComponentProps>;

interface InviteContactsComponentProps {  }
type InviteContactsComponentType = NavigationComponent<InviteContactsComponentProps>;

interface RegistrationComponentProps { 
    userId: string,
    signUpWithEmail: boolean
}
type RegistrationComponentType = NavigationComponent<RegistrationComponentProps>;