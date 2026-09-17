public class SelectionDescending {
    
    public static void main(String[] args) {
        int[] arr1={5,4,6,2,8,1};
        int temp,index;
        for(int i=0;i<arr1.length;i++){
            index=i; 
            for(int j=i+1;j<arr1.length;j++){
                index=j;
            }
                if(arr1[i]<arr1[index]){
                temp=arr1[i];
                arr1[i]=arr1[index];
                arr1[index]=temp; 
            } 
             
            System.out.print(arr1[i]+" ");
        }
         
        

    }
    
}

    

