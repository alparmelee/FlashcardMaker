// flashcardData.js
export async function saveFlashcardSet(setName, flashcards, existingSetId = null) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated.');
  }

  let setId = existingSetId;
  if (setId) {
    await supabase.from('flashcard_sets').update({ title: setName }).eq('id', setId);
    await supabase.from('flashcards').delete().eq('set_id', setId);
  } else {
    const { data: set, error } = await supabase
      .from('flashcard_sets')
      .insert([{ title: setName, user_id: user.id, terms_count: flashcards.length }])
      .select()
      .single();
    if (error || !set) throw new Error('Set creation failed');
    setId = set.id;
  }

  const flashcardRows = flashcards.map(f => ({ set_id: setId, term: f.term, definition: f.definition }));
  const { error: insertError } = await supabase.from('flashcards').insert(flashcardRows);
  if (insertError) throw new Error('Failed to insert flashcards');

  return setId;
}

export async function loadSet(setId) {
  const { data: set } = await supabase
    .from('flashcard_sets')
    .select('title')
    .eq('id', setId)
    .single();

  const { data: cards } = await supabase
    .from('flashcards')
    .select('term, definition')
    .eq('set_id', setId);

  return { title: set.title, cards };
}
