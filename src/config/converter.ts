import Showdown from 'showdown';

const converter = new Showdown.Converter();
converter.setFlavor('github');
converter.setOption('tasklists', true);
converter.setOption('emoji', true);

export default converter;
