import Mixin from '@ember/object/mixin';

export default Mixin.create({
  actions: {
    setTextBoxClosed(){
      this.closeTextbox.set('textboxIsClosed', true);
      localStorage.setItem('mobility-explorer-hide-intro', 'true');
    },
  }
});
