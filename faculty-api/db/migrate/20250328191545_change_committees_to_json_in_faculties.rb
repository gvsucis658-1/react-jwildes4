class ChangeCommitteesToJsonInFaculties < ActiveRecord::Migration[8.0]
  def change
    change_column :faculties, :committees, :jsonb, default: []
  end
end
