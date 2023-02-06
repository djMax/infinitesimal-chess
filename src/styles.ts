import { makeStyles } from '@rneui/themed';
import { Platform } from 'react-native';

export const useStyles = makeStyles((theme) => ({
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    marginTop: 20,
    fontWeight: '600',
    paddingBottom: 5,
    paddingLeft: 15,
    fontSize: 18,
  },
  settingsContainer: {
    flex: 1,
  },
  settingsItem: {
    backgroundColor: theme.colors.white,
  },
  chevron: {
    color: theme.colors.grey4,
  },
  rightText: {
    color: theme.colors.grey2,
  },
  button: {
    borderRadius: 6,
    paddingVertical: 4,
    marginBottom: 15,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  topX: {
    alignItems: 'flex-end',
    paddingTop: 20,
    ...Platform.select({
      web: {
        marginRight: 10,
        marginTop: 10,
      },
    }),
  },
  wideLimit: {
    maxWidth: 800,
    alignSelf: 'center',
  },
}));
